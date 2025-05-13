import { useEffect, useReducer, useRef } from "react";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import { Layouts, Page, useNotification } from '@strapi/admin/strapi-admin';
import { Page as PageOld } from '@strapi/strapi/admin';
import { Check, Plus, Trash } from "@strapi/icons";
import { Box, Typography, Button, Link, Flex, Grid, Toggle, NumberInput, Field } from "@strapi/design-system";
import axios from "axios";
import isEqual from "lodash/isEqual";
import { axiosInstance, getRequestUrl, getTranslation } from "../../utils";
import init from "./init";
import reducer, { initialState } from "./reducer";
import { pluginPermissions } from "../../permissions";
import ImageFormat from "../../components/ImageFormat";

export const SettingsPage = () => {
  const { formatMessage } = useIntl();
  const { toggleNotification } = useNotification();

  const [
    { initialData, isLoading, isSubmiting, modifiedData, responsiveDimensions },
    dispatch,
  ] = useReducer(reducer, initialState, init);

  const isMounted = useRef(true);

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const getData = async () => {
      try {
        const {
          data: { data },
        } = await axiosInstance.get(getRequestUrl("settings"), {
          cancelToken: source.token,
        });

        const {
          data: { data: uploadSettings },
        } = await axiosInstance.get("/upload/settings", {
          cancelToken: source.token,
        });

        dispatch({
          type: "GET_DATA_SUCCEEDED",
          data: {
            ...data,
            responsiveDimensions: uploadSettings.responsiveDimensions,
          },
        });
      } catch (err) {
        console.error(err);
      }
    };

    if (isMounted.current) {
      getData();
    }

    return () => {
      source.cancel("Operation canceled by the user.");
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isSaveButtonDisabled = isEqual(initialData, modifiedData);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (isSaveButtonDisabled) {
      return;
    }

    dispatch({ type: "ON_SUBMIT" });

    try {
      await axiosInstance.put(getRequestUrl("settings"), modifiedData);

      dispatch({
        type: "SUBMIT_SUCCEEDED",
      });

      toggleNotification({
        type: "success",
        message: formatMessage({
          id: "notification.form.success.fields",
        }),
      });
    } catch (err: any) {
      console.error(err);

      try {
        toggleNotification({
          type: "warning",
          message: err.response.data.error.message || err.message,
        });
      } catch (error) {}

      dispatch({ type: "ON_SUBMIT_ERROR" });
    }
  };

  const handleChange = ({ target: { name, value } }: any) => {
    dispatch({
      type: "ON_CHANGE",
      keys: name,
      value,
    });
  };

  const handleFormatsChange = ({ target: { name, value } }: any, index: any) => {
    dispatch({
      type: "ON_FORMATS_CHANGE",
      keys: name,
      value,
      index,
    });
  };

  const handleAddFormat = () => {
    dispatch({
      type: "ADD_FORMAT",
    });
  };

  const handleDeleteFormat = (index: any) => {
    dispatch({
      type: "DELETE_FORMAT",
      index,
    });
  };

  if (!responsiveDimensions) {
    return (
      <Layouts.Content>
        <Box
          background="neutral0"
          padding={6}
          shadow="filterShadow"
          hasRadius
          style={{ textAlign: "center", marginTop: 50, fontSize: "1.2em" }}
        >
          <Typography variant="beta">
            {formatMessage(
              { id: getTranslation("settings.section.toActivate.label") },
              {
                setting: formatMessage({
                  id: "upload.settings.form.responsiveDimensions.label",
                }),
                link: (str) => (
                  <Link href="/admin/settings/media-library" key="settings-link">
                    {str}
                  </Link>
                ),
              }
            )}
          </Typography>
        </Box>
      </Layouts.Content>
    );
  }

  return (
    <Page.Main>
      <Helmet
        title={formatMessage({
          id: getTranslation("page.title"),
          defaultMessage: "Settings - Responsive Image",
        })}
      />
      <form onSubmit={handleSubmit}>
        <Layouts.Header
          title={formatMessage({
            id: getTranslation("settings.header.label"),
            defaultMessage: "Responsive image",
          })}
          primaryAction={
            <Button
              disabled={isSaveButtonDisabled}
              data-testid="save-button"
              loading={isSubmiting}
              type="submit"
              startIcon={<Check />}
              size="L"
            >
              {formatMessage({
                id: "app.components.Button.save",
                defaultMessage: "Save",
              })}
            </Button>
          }
          subtitle={formatMessage({
            id: getTranslation("settings.sub-header.label"),
            defaultMessage: "Configure the settings for the responsive image",
          })}
        />
        <Layouts.Content>
          {isLoading ? (
            <Page.Loading />
          ) : (<Layouts.Root>
                <Box
                  background="neutral0"
                  padding={6}
                  shadow="filterShadow"
                  hasRadius
                >
                  <Flex>
                    <Typography variant="delta" as="h2">
                      {formatMessage({
                        id: getTranslation("settings.section.global.label"),
                      })}
                    </Typography>
                  </Flex>
                  <Grid.Root gap={6} style={{ marginTop: 16 }}>
                    <Grid.Item col={6} s={12} direction="column" alignItems="stretch">
                      <Field.Root>
                        <Field.Label>
                          {formatMessage({
                              id: getTranslation("settings.form.quality.label")})}
                        </Field.Label>
                        <NumberInput
                          label={formatMessage({
                            id: getTranslation("settings.form.quality.label"),
                          })}
                          name="quality"
                          validations={{
                            min: 1,
                            max: 100,
                          }}
                          onValueChange={(value: any) =>
                            handleChange({
                              target: {
                                name: "quality",
                                value,
                              },
                            })
                          }
                          value={modifiedData.quality}
                        />
                      </Field.Root>
                    </Grid.Item>
                    <Grid.Item col={6} s={12} direction="column" alignItems="stretch">
                      <Field.Root>
                        <Field.Label>
                          {formatMessage({
                            id: getTranslation("settings.form.progressive.label")})}
                        </Field.Label>
                        <Toggle
                          checked={modifiedData.progressive}
                          label={formatMessage({
                            id: getTranslation("settings.form.progressive.label"),
                          })}
                          name="progressive"
                          offLabel={formatMessage({
                            id: "app.components.ToggleCheckbox.off-label",
                            defaultMessage: "Off",
                          })}
                          onLabel={formatMessage({
                            id: "app.components.ToggleCheckbox.on-label",
                            defaultMessage: "On",
                          })}
                          onChange={(e: any) => {
                            handleChange({
                              target: {
                                name: "progressive",
                                value: e.target.checked,
                              },
                            });
                          }}
                        />
                      </Field.Root>
                    </Grid.Item>
                  </Grid.Root>
                </Box>
                <Layouts.Header
                  primaryAction={
                    <Button startIcon={<Plus />} onClick={handleAddFormat} type="button">
                      {formatMessage({
                        id: getTranslation("settings.section.formats.add.label"),
                      })}
                    </Button>
                  }
                  title={formatMessage({
                    id: getTranslation("settings.section.formats.label"),
                  })}
                  as="h2"
                  style={{
                    margin: "0 -56px 0 -56px",
                  }}
                />
                {modifiedData.formats.map((input: any, index: number) => (
                  <Box
                    key={index}
                    background="neutral0"
                    padding={6}
                    shadow="filterShadow"
                    hasRadius
                    style={{ marginTop: 30 }}
                  >
                    <ImageFormat
                      format={input}
                      handleFormatsChange={handleFormatsChange}
                      index={index}
                    />
                    <Button
                      variant="danger"
                      startIcon={<Trash />}
                      onClick={() => handleDeleteFormat(index)}
                      style={{
                        marginTop: 25,
                      }}
                    >
                      {formatMessage({
                        id: getTranslation("settings.section.formats.delete.label"),
                      })}
                    </Button>
                  </Box>
                ))}
            </Layouts.Root>
          )}
        </Layouts.Content>
      </form>
    </Page.Main>
  );
};

const ProtectedSettingsPage = () => (
  <PageOld.Protect permissions={pluginPermissions.settings}>
    <SettingsPage />
  </PageOld.Protect>
);

export default ProtectedSettingsPage;
