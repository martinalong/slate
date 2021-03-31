import * as React from "react";
import * as Strings from "~/common/strings";
import * as Constants from "~/common/constants";
import * as System from "~/components/system";
import * as Validations from "~/common/validations";
import * as Actions from "~/common/actions";
import * as Events from "~/common/custom-events";

import { css } from "@emotion/react";
import { Tag } from "~/components/system/components/Tag";

const STYLES_GROUPING = css`
  width: 100%;
  border: 1px solid rgba(196, 196, 196, 0.5);
  background-color: ${Constants.system.white};
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 40px;
`;

export default class SidebarEditTags extends React.Component {
  state = {
    tags:
      !Array.isArray(this.props.sidebarData.commonTags) ||
      this.props.sidebarData.commonTags?.length === 0
        ? []
        : this.props.sidebarData.commonTags,
    suggestions:
      !Array.isArray(this.props.sidebarData.suggestions) ||
      this.props.sidebarData.suggestions?.length === 0
        ? []
        : this.props.sidebarData.suggestions,
  };

  _handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  updateSuggestions = () => {
    let suggestions = this.props.sidebarData.suggestions || [];
    let tags = this.state.tags || [];

    let newSuggestions = new Set([...suggestions, ...tags]);
    this.setState({ suggestions: Array.from(newSuggestions) });
  };

  _handleSave = async (details, index) => {
    let { objects } = this.props.sidebarData;

    objects[index] = { ...objects[index], ...details };
    const response = await Actions.updateData({
      id: this.props.viewer.id,
      data: objects[index],
    });

    this.props.onUpdateViewer({ tags: this.state.suggestions });

    Events.hasError(response);
  };

  _handleSubmit = async () => {
    this.props.onCancel();

    let { checked, objects, commonTags } = this.props.sidebarData;
    const checkedIndexes = Object.keys(checked);
    let data;

    await Promise.all(
      checkedIndexes.map(async (checkedIndex) => {
        let objectTags = Array.isArray(objects[checkedIndex]?.tags)
          ? objects[checkedIndex].tags
          : [];
        let newTags = this.state.tags;

        /* NOTE(daniel): since there are no common tags, we are simply adding new tags to the files */
        if (!commonTags.length) {
          data = { tags: [...new Set([...objectTags, ...newTags])] };
          return await this._handleSave(data, checkedIndex);
        }

        /* NOTE(daniel): symmetrical difference between new tags and common tags */
        let diff = newTags
          .filter((i) => !commonTags.includes(i))
          .concat(commonTags.filter((i) => !newTags.includes(i)));

        let update = diff.reduce((acc, cur) => {
          if (!commonTags.includes(cur) && newTags.includes(cur)) {
            acc.push(cur);
          } else if (commonTags.includes(cur) && !newTags.includes(cur)) {
            let removalIndex = acc.findIndex((item) => item === cur);
            acc.splice(removalIndex, 1);
          }

          return acc;
        }, objectTags);

        data = { tags: update };

        return await this._handleSave(data, checkedIndex);
      })
    );

    this.updateSuggestions();
  };

  render() {
    const { numChecked } = this.props.sidebarData;

    return (
      <div style={{ marginBottom: 64 }}>
        <System.P
          style={{
            fontFamily: Constants.font.semiBold,
            fontSize: Constants.typescale.lvl2,
            marginBottom: 36,
          }}
        >
          Edit tags
        </System.P>

        <div css={STYLES_GROUPING}>
          <System.P
            style={{
              fontFamily: Constants.font.semiBold,
              fontSize: Constants.typescale.lvl1,
              marginBottom: 8,
            }}
          >
            Tags
          </System.P>
          <System.P
            style={{
              fontFamily: Constants.font.text,
              fontSize: Constants.typescale.lvl0,
              color: Constants.system.textGray,
              marginBottom: 16,
            }}
          >
            Add or remove common tags on your files
          </System.P>
          <Tag
            name="tags"
            placeholder={`Edit tags for ${`${numChecked} file${numChecked === 1 ? "" : "s"}`} `}
            tags={this.state.tags}
            suggestions={this.state.suggestions}
            onChange={this._handleChange}
            /* handleTagDelete={this._handleTagDelete} */
          />
        </div>

        <System.ButtonPrimary
          full
          style={{ padding: "14px 0" }}
          onClick={() => this._handleSubmit()}
        >
          Update tags for {`${numChecked} file${numChecked === 1 ? "" : "s"}`}
        </System.ButtonPrimary>
      </div>
    );
  }
}
