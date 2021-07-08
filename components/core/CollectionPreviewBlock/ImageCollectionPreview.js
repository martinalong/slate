import * as React from "react";
import * as Strings from "~/common/strings";
import * as Typography from "~/components/system/components/Typography";
import * as Styles from "~/common/styles";
import * as SVG from "~/common/svg";

import { useInView } from "~/common/hooks";
import { isBlurhashValid } from "blurhash";
import { Blurhash } from "react-blurhash";
import { css } from "@emotion/react";

const STYLES_CONTAINER = (theme) => css`
  display: flex;
  flex-direction: column;
  position: relative;
  border-radius: 8px;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;

  height: 311px;
  @media (max-width: ${theme.sizes.mobile}px) {
    height: 281px;
  }
`;

const STYLES_PREVIEW = (theme) => css`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: ${theme.system.white};
  background-size: cover;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const STYLES_DESCRIPTION_CONTAINER = (theme) => css`
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: ${theme.system.white};
  @supports ((-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(75px))) {
    background-color: ${theme.system.bgBlurLight6OP};
    -webkit-backdrop-filter: blur(75px);
    backdrop-filter: blur(75px);
  }
  width: 100%;
  margin-top: auto;
`;

const STYLES_SPACE_BETWEEN = css`
  justify-content: space-between;
`;

const STYLES_CONTROLLS = css`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: relative;
  padding: 16px 0px 16px 16px;
`;

const STYLES_PROFILE_IMAGE = (theme) => css`
  background-color: ${theme.system.foreground};
  height: 20px;
  width: 20px;
  border-radius: 4px;
  object-fit: cover;
`;

const STYLES_HIGHLIGHT_BUTTON = (theme) => css`
  box-sizing: border-box;
  display: block;
  padding: 4px 16px;
  border: none;
  background-color: unset;
  div {
    width: 8px;
    height: 8px;
    background-color: ${theme.system.gray};
    border-radius: 50%;
  }
`;

const STYLES_METRICS = (theme) => css`
  margin-top: 16px;
  @media (max-width: ${theme.sizes.mobile}px) {
    margin-top: 12px;
  }
  ${Styles.CONTAINER_CENTERED};
  ${STYLES_SPACE_BETWEEN}
`;

const getFileBlurHash = (file) => {
  const coverImage = file?.data?.coverImage;
  const coverImageBlurHash = coverImage?.data?.blurhash;
  if (coverImage && isBlurhashValid(coverImageBlurHash)) return coverImageBlurHash;

  const blurhash = file?.data?.blurhash;
  if (isBlurhashValid(blurhash)) return blurhash;

  return null;
};

const useCollectionCarrousel = ({ objects }) => {
  const [selectedIdx, setSelectedIdx] = React.useState(0);
  const selectImageByIdx = (idx) => setSelectedIdx(idx);

  const [imagesLoadedIdx, setImagesLoadedIdx] = React.useState({});
  const handleLoading = () => setImagesLoadedIdx((prev) => ({ ...prev, [selectedIdx]: true }));

  const isCurrentImageLoaded = imagesLoadedIdx[selectedIdx];
  const { image: selectedImage, blurhash } = objects[selectedIdx];
  return {
    selectedImage,
    selectedIdx,
    isLoaded: isCurrentImageLoaded,
    blurhash,
    handleLoading,
    selectImageByIdx,
  };
};

export default function ImageCollectionPreview({ collection }) {
  const filePreviews = React.useMemo(() => {
    const previews = collection.objects.map((object) => {
      const coverImage = object?.data?.coverImage;
      const image = coverImage || Strings.getURLfromCID(object.cid);
      const blurhash = getFileBlurHash(object);
      return { image, blurhash };
    });
    return previews.slice(0, 3);
  }, [collection]);

  const previewerRef = React.useRef();
  const { isInView } = useInView({
    ref: previewerRef,
  });

  const { isLoaded, blurhash, selectedImage, handleLoading, selectedIdx, selectImageByIdx } =
    useCollectionCarrousel({ objects: filePreviews });

  const nbrOfFiles = collection?.objects?.length || 0;
  return (
    <div ref={previewerRef} css={STYLES_CONTAINER}>
      {isInView && (
        <div css={STYLES_PREVIEW}>
          {!isLoaded && blurhash && (
            <Blurhash
              hash={blurhash}
              style={{ position: "absolute", top: 0, left: 0 }}
              height="100%"
              width="100%"
              resolutionX={32}
              resolutionY={32}
              punch={1}
            />
          )}
          <img src={selectedImage} alt="Collection preview" onLoad={handleLoading} />
        </div>
      )}
      <div css={STYLES_CONTROLLS}>
        {filePreviews.map((preview, i) => (
          <button
            key={preview.image}
            css={[Styles.HOVERABLE, STYLES_HIGHLIGHT_BUTTON]}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              selectImageByIdx(i);
            }}
            aria-label="Next Preview Image"
          >
            <div style={{ opacity: i === selectedIdx ? 1 : 0.3 }} />
          </button>
        ))}
      </div>
      <div css={STYLES_DESCRIPTION_CONTAINER}>
        <div>
          <div css={[Styles.HORIZONTAL_CONTAINER_CENTERED, STYLES_SPACE_BETWEEN]}>
            <Typography.H4 color="textBlack" nbrOflines={1}>
              {collection.slatename}
            </Typography.H4>
            <Typography.P variant="para-02" color="textGrayDark">
              {nbrOfFiles} {Strings.pluralize("Object", nbrOfFiles)}
            </Typography.P>
          </div>
          {collection?.data?.body && (
            <Typography.P
              style={{ marginTop: 4 }}
              variant="para-02"
              nbrOflines={2}
              color="textGrayDark"
            >
              {collection?.data?.body}
            </Typography.P>
          )}
        </div>

        <div css={STYLES_METRICS}>
          <div css={Styles.CONTAINER_CENTERED}>
            <SVG.RSS width={20} height={20} />
            <Typography.P style={{ marginLeft: 8 }} color="textGrayDark">
              {collection?.subscriberCount}
            </Typography.P>
          </div>
          <div css={Styles.CONTAINER_CENTERED}>
            <img
              css={STYLES_PROFILE_IMAGE}
              src="https://slate.textile.io/ipfs/bafkreick3nscgixwfpq736forz7kzxvvhuej6kszevpsgmcubyhsx2pf7i"
              alt="owner profile"
            />
            <Typography.P style={{ marginLeft: 8 }} variant="para-02" color="textGrayDark">
              Wes Anderson
            </Typography.P>
          </div>
        </div>
      </div>
    </div>
  );
}
