import { useEffect } from "react";
import { useIntl } from "react-intl";
import {
  TextInput,
  NumberInput,
  Grid,
  SingleSelect,
  SingleSelectOption,
  Toggle,
  Field
} from "@strapi/design-system";
import { getTranslation } from "../utils";

export default function ImageFormat(props: { format: any; handleFormatsChange: Function; index: number; }) {
  const { formatMessage } = useIntl();

  const fitList = ["cover", "contain", "fill", "inside", "outside"];
  const positionList = [
    "centre",
    "center",
    "north",
    "northeast",
    "east",
    "southeast",
    "south",
    "southwest",
    "west",
    "northwest",
  ];
  const convertToFormatList = [
    { value: "", label: "Same as source" },
    { value: "jpg", label: "JPEG" },
    { value: "png", label: "PNG" },
    { value: "webp", label: "WebP" },
    { value: "avif", label: "AVIF" },
  ];

  const input = props.format;
  const handleFormatsChange = props.handleFormatsChange;
  const index = props.index;

  useEffect(() => {
    // If the name is empty it means we added a new one
    if (input.name === "") {
      const newNameInput = document.getElementById(`responsive-image-name-${index}`);

      if (newNameInput !== null) {
        newNameInput.focus();
      }
    }
  });

  return (
    <Grid.Root gap={6}>
      <Grid.Item col={6} s={12} direction="column" alignItems="stretch">
        <Field.Root hint={formatMessage({
            id: getTranslation("settings.form.formats.name.description"),
          })}>
          <Field.Label>
            {formatMessage({
                id: getTranslation("settings.form.formats.name.label")})}
          </Field.Label>
          <TextInput
            // ref={inputName} // Ref doesn't work: Function components cannot be given refs. Attempts to access this ref will fail.
            id={`responsive-image-name-${index}`}
            label={formatMessage({
              id: getTranslation("settings.form.formats.name.label"),
            })}
            validations={{
              required: true,
            }}
            name="name"
            onChange={(target: any) => handleFormatsChange(target, index)}
            type="text"
            value={input.name}
          />
          <Field.Hint />
        </Field.Root>
      </Grid.Item>
      <Grid.Item col={3} s={6} direction="column" alignItems="stretch">
        <Field.Root hint={`${input.width * 2}px`}>
          <Field.Label>
            {formatMessage({
                id: getTranslation("settings.form.formats.x2.label")})}
          </Field.Label>
          <Toggle
            checked={input.x2}
            label={formatMessage({
              id: getTranslation("settings.form.formats.x2.label"),
            })}
            name="x2"
            offLabel={formatMessage({
              id: "app.components.ToggleCheckbox.off-label",
              defaultMessage: "Off",
            })}
            onLabel={formatMessage({
              id: "app.components.ToggleCheckbox.on-label",
              defaultMessage: "On",
            })}
            onChange={(e: any) => {
              handleFormatsChange(
                {
                  target: {
                    name: "x2",
                    value: e.target.checked,
                  },
                },
                index
              );
            }}
          />
          <Field.Hint />
        </Field.Root>
      </Grid.Item>
      <Grid.Item col={3} s={6} direction="column" alignItems="stretch">
        <Field.Root hint={formatMessage({
            id: getTranslation("settings.form.formats.convertToFormat.description"),
          })}>
          <Field.Label>
            {formatMessage({
                id: getTranslation("settings.form.formats.convertToFormat.label")})}
          </Field.Label>
          <SingleSelect
            onValueChange={
              (value: any) =>
                handleFormatsChange(
                  {
                    target: {
                      name: "convertToFormat",
                      value,
                    },
                  },
                  index
                )
            }
            aria-label={getTranslation("settings.form.formats.convertToFormat.label")}
            id="convertToFormat"
            label={formatMessage({
              id: getTranslation("settings.form.formats.convertToFormat.label"),
            })}
            hint={formatMessage({
              id: getTranslation("settings.form.formats.convertToFormat.description"),
            })}
            name="convertToFormat"
            value={input.convertToFormat}
            selectButtonTitle="Carret Down Button"
            onChange={(value: any) =>
              handleFormatsChange(
                {
                  target: {
                    name: "convertToFormat",
                    value,
                  },
                },
                index
              )
            }
          >
            {convertToFormatList.map((format) => (
              <SingleSelectOption key={format.value} value={format.value}>
                {format.label}
              </SingleSelectOption>
            ))}
          </SingleSelect>
          <Field.Hint />
        </Field.Root>
      </Grid.Item>
      <Grid.Item col={6} s={12} direction="column" alignItems="stretch">
        <Field.Root>
          <Field.Label>
            {formatMessage({
                id: getTranslation("settings.form.formats.width.label")})}
          </Field.Label>
          <NumberInput
            label={formatMessage({
              id: getTranslation("settings.form.formats.width.label"),
            })}
            name="width"
            validations={{
              min: 1,
            }}
            onValueChange={(value: any) =>
              handleFormatsChange(
                {
                  target: {
                    name: "width",
                    value,
                  },
                },
                index
              )
            }
            value={input.width}
          />
        </Field.Root>
      </Grid.Item>
      <Grid.Item col={6} s={12} direction="column" alignItems="stretch">
        <Field.Root>
          <Field.Label>
            {formatMessage({
                id: getTranslation("settings.form.formats.height.label")})}
          </Field.Label>
          <NumberInput
            label={formatMessage({
              id: getTranslation("settings.form.formats.height.label"),
            })}
            name="height"
            onValueChange={(value: any) =>
              handleFormatsChange(
                {
                  target: {
                    name: "height",
                    value,
                  },
                },
                index
              )
            }
            value={input.height}
          />
        </Field.Root>
      </Grid.Item>
      <Grid.Item col={4} s={7} direction="column" alignItems="stretch">
        <Field.Root hint={formatMessage({
              id: getTranslation("settings.form.formats.fit.description"),
            })}>
          <Field.Label>
            {formatMessage({
                id: getTranslation("settings.form.formats.fit.label")})}
          </Field.Label>
          <SingleSelect
            label={formatMessage({
              id: getTranslation("settings.form.formats.fit.label"),
            })}
            hint={formatMessage({
              id: getTranslation("settings.form.formats.fit.description"),
            })}
            name="fit"
            value={input.fit}
            selectButtonTitle="Carret Down Button"
            onChange={(value: any) =>
              handleFormatsChange(
                {
                  target: {
                    name: "fit",
                    value,
                  },
                },
                index
              )
            }
          >
            {fitList.map((fit) => (
              <SingleSelectOption key={fit} value={fit}>
                {fit}
              </SingleSelectOption>
            ))}
          </SingleSelect>
          <Field.Hint />
        </Field.Root>
      </Grid.Item>
      <Grid.Item col={4} s={7} direction="column" alignItems="stretch">
        <Field.Root hint={formatMessage({
              id: getTranslation("settings.form.formats.position.description"),
            })}>
          <Field.Label>
            {formatMessage({
                id: getTranslation("settings.form.formats.position.label")})}
          </Field.Label>
          <SingleSelect
            label={formatMessage({
              id: getTranslation("settings.form.formats.position.label"),
            })}
            hint={formatMessage({
              id: getTranslation("settings.form.formats.position.description"),
            })}
            name="position"
            value={input.position}
            selectButtonTitle="Carret Down Button"
            onChange={(value: any) =>
              handleFormatsChange(
                {
                  target: {
                    name: "position",
                    value,
                  },
                },
                index
              )
            }
          >
            {positionList.map((position) => (
              <SingleSelectOption key={position} value={position}>
                {position}
              </SingleSelectOption>
            ))}
          </SingleSelect>
          <Field.Hint />
        </Field.Root>
      </Grid.Item>
      <Grid.Item col={4} s={7} direction="column" alignItems="stretch">
        <Field.Root hint={formatMessage({
              id: getTranslation("settings.form.formats.withoutEnlargement.description"),
            })}>
          <Field.Label>
            {formatMessage({
                id: getTranslation("settings.form.formats.withoutEnlargement.label")})}
          </Field.Label>
          <Toggle
            checked={input.withoutEnlargement}
            label={formatMessage({
              id: getTranslation("settings.form.formats.withoutEnlargement.label"),
            })}
            name="withoutEnlargement"
            offLabel={formatMessage({
              id: "app.components.ToggleCheckbox.off-label",
              defaultMessage: "Off",
            })}
            onLabel={formatMessage({
              id: "app.components.ToggleCheckbox.on-label",
              defaultMessage: "On",
            })}
            onChange={(e: any) => {
              handleFormatsChange({
                target: {
                  name: "withoutEnlargement",
                  value: e.target.checked,
                },
              }, index);
            }}
          />
          <Field.Hint />
        </Field.Root>
      </Grid.Item>
    </Grid.Root>
  );
};
