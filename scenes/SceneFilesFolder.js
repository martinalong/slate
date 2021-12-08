import * as React from "react";
import * as Constants from "~/common/constants";
import * as Styles from "~/common/styles";
import * as System from "~/components/system";
import * as SVG from "~/common/svg";

import { css } from "@emotion/react";
import { GlobalCarousel } from "~/components/system/components/GlobalCarousel";
import { FileTypeGroup } from "~/components/core/FileTypeIcon";
import { TagsOnboarding } from "~/components/core/Onboarding/Tags";

import ScenePage from "~/components/core/ScenePage";
import WebsitePrototypeWrapper from "~/components/core/WebsitePrototypeWrapper";
import DataView from "~/components/core/DataView";
import EmptyState from "~/components/core/EmptyState";

const STYLES_SCENE_PAGE = css`
  padding: 0px;
  @media (max-width: ${Constants.sizes.mobile}px) {
    padding: 0px;
  }
`;

const STYLES_EMPTY_STATE_WRAPPER = (theme) => css`
  // NOTE(amine): 100vh - headers' height - Dataviewer's bottom padding
  height: calc(100vh - ${theme.sizes.filterNavbar + theme.sizes.header}px - 44px);
  margin: 20px;
  @media (max-width: ${theme.sizes.mobile}px) {
    margin: 0px;
    height: calc(100vh - ${theme.sizes.header}px - 44px);
  }
`;

const STYLES_EMPTY_STATE_DEMO = (theme) => css`
  margin-top: 36px;
  @media (max-width: ${theme.sizes.mobile}px) {
    margin-top: 65px;
  }
`;

const STYLES_UPLOAD_BUTTON = (theme) => css`
  ${Styles.CONTAINER_CENTERED};
  display: inline-flex;
  background-color: ${theme.semantic.bgGrayLight};
  border-radius: 8px;
  width: 24px;
  height: 24px;
  pointer-events: auto;
  box-shadow: ${theme.shadow.lightSmall};
`;

export default function SceneFilesFolder({ viewer, page, onAction, isMobile }) {
  const [index, setIndex] = React.useState(-1);

  let objects = viewer.library;
  // const tab = page.params?.tab || "grid";

  return (
    <WebsitePrototypeWrapper
      title={`${page.pageTitle} • Slate`}
      url={`${Constants.hostname}${page.pathname}`}
    >
      <ScenePage css={STYLES_SCENE_PAGE}>
        <GlobalCarousel
          viewer={viewer}
          objects={objects}
          onAction={onAction}
          isMobile={isMobile}
          params={page.params}
          isOwner={true}
          index={index}
          onChange={(index) => setIndex(index)}
        />
        {objects.length > 0 ? (
<<<<<<< HEAD
          <div css={Styles.PAGE_CONTENT_WRAPPER}>
            <TagsOnboarding
              onAction={onAction}
              viewer={viewer}
              isActive={isOnboardingActive}
              isMobile={isMobile}
            >
=======
          <div css={STYLES_DATAVIEWER_WRAPPER}>
            <TagsOnboarding onAction={onAction} viewer={viewer} isMobile={isMobile}>
>>>>>>> ee5d2c4f (feat(Onboarding): conditionally render survey onboarding)
              <DataView
                key="scene-files-folder"
                isOwner={true}
                items={objects}
                onAction={onAction}
                viewer={viewer}
                page={page}
                view="grid"
              />
            </TagsOnboarding>
          </div>
        ) : (
          <EmptyState css={STYLES_EMPTY_STATE_WRAPPER}>
            <FileTypeGroup />
            <div css={STYLES_EMPTY_STATE_DEMO}>
              <System.H5 as="p" color="textDark" style={{ textAlign: "center" }}>
                Use
                <span
                  css={STYLES_UPLOAD_BUTTON}
                  style={{ marginLeft: 8, marginRight: 8, position: "relative", top: 2 }}
                >
                  <SVG.Plus height="16px" />
                </span>
                on the top right corner <br />
              </System.H5>
              <System.H5 as="p" color="textDark" style={{ marginTop: 4, textAlign: "center" }}>
                or drop files {isMobile ? <span> on desktop</span> : null} to save to Slate
              </System.H5>
            </div>
          </EmptyState>
        )}
      </ScenePage>
    </WebsitePrototypeWrapper>
  );
}
