'use strict';
/**
 * Image manipulation functions
 */

const fs = require('fs');
const { join } = require('path');
const sharp = require('sharp');
const mime = require('mime-types');

const {
  file: { bytesToKbytes },
} = require('@strapi/utils');
import getService from '../utils';
const pluginUpload = require('@strapi/upload/strapi-server');
const imageManipulation = pluginUpload().services['image-manipulation'];

const writeStreamToFile = (stream, path) =>
  new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(path);
    // Reject promise if there is an error with the provided stream
    stream.on('error', reject);
    stream.pipe(writeStream);
    writeStream.on('close', resolve);
    writeStream.on('error', reject);
  });

const getMetadata = (file) =>
  new Promise((resolve, reject) => {
    const pipeline = sharp();
    pipeline.metadata().then(resolve).catch(reject);
    file.getStream().pipe(pipeline);
  });

const resizeFileTo = async (
  file,
  options,
  quality,
  progressive,
  autoOrientation,
  { name, hash, ext, format }
) => {
  const filePath = join(file.tmpWorkingDirectory, hash);

  let sharpInstance = autoOrientation ? sharp().rotate() : sharp();

  if (options.convertToFormat) {
    sharpInstance = sharpInstance.toFormat(options.convertToFormat);
  }

  switch (options.convertToFormat) {
    case 'jpg':
      sharpInstance.jpeg({ quality, mozjpeg: true, progressive, force: false });
      break;
    case 'png':
      sharpInstance.png({
        compressionLevel: Math.floor((quality / 100) * 9),
        progressive,
        force: false,
      });
      break;
    case 'webp':
      sharpInstance.webp({ quality, force: false });
      break;
    case 'avif':
      sharpInstance.avif({ quality });
      break;

    default:
      break;
  }

  sharpInstance.resize(options);

  await writeStreamToFile(file.getStream().pipe(sharpInstance), filePath);
  const newFile = {
    name,
    hash,
    ext,
    mime: options.convertToFormat ? mime.lookup(ext) : file.mime,
    path: file.path || null,
    getStream: () => fs.createReadStream(filePath),
  };

  const { width, height, size } = (await getMetadata(newFile)) as any;

  Object.assign(newFile, { width, height, size: bytesToKbytes(size) });
  return newFile;
};

const generateResponsiveFormats = async (file) => {
  const { responsiveDimensions = false, autoOrientation = false } = await strapi
    .plugin('upload')
    .service('upload')
    .getSettings();

  if (!responsiveDimensions) return [];

  // if (!(await isImage(file))) {
  //   return [];
  // }

  const { formats, quality, progressive } = await getService('responsive-image').getSettings();

  const minFormat = formats
    .filter((format) => format.width > 1)
    .reduce((min, current) => (current.width <= min.width ? current : min));

  const x2Formats = [];
  const x1Formats = formats.map((format) => {
    if (format.x2) {
      x2Formats.push(
        generateBreakpoint(
          `${format.name}_x2`,
          {
            file,
            format: {
              ...format,
              width: format.width * 2,
              height: format.height ? format.height * 2 : null,
            },
            quality,
            progressive,
            autoOrientation,
          },
          minFormat
        )
      );
    }
    return generateBreakpoint(
      format.name,
      {
        file,
        format,
        quality,
        progressive,
        autoOrientation,
      },
      minFormat
    );
  });

  return Promise.all([...x1Formats, ...x2Formats]);
};

const getFileExtension = (file, { convertToFormat }) => {
  if (!convertToFormat) {
    return file.ext;
  }

  return `.${convertToFormat}`;
};

const generateBreakpoint = async (
  key,
  { file, format, quality, progressive, autoOrientation },
  minFormat
) => {
  const fileMetaData = (await getMetadata(file)) as any;

  // "Min" formats
  if (format.width === 1) {
    if (fileMetaData.width < minFormat.width) {
      // Only created, if there's no other matching format
      format.width = fileMetaData.width;
    } else {
      return;
    }
  }

  if (
    (format.withoutEnlargement && fileMetaData.width >= format.width) ||
    !format.withoutEnlargement
  ) {
    const newFile = await resizeFileTo(file, format, quality, progressive, autoOrientation, {
      name: `${key}_${file.name}`,
      hash: `${key}_${file.hash}`,
      ext: getFileExtension(file, format),
      format,
    });

    return {
      key,
      file: newFile,
    };
  }
};

export default () => ({
  ...imageManipulation,
  generateResponsiveFormats,
});
