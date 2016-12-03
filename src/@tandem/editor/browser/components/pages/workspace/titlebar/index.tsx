import "./index.scss";
import * as React from "react";
import { BaseApplicationComponent } from "@tandem/common";

export class WorkspaceTitlebarComponent extends BaseApplicationComponent<any, any> {
  render() {
    return <div className="td-workspace-titlebar row">
      <div className="col-3">
        &nbsp;
      </div>
      <div className="col-6 tools">
        <i className="ion-android-document selected fill-text hide" />
        <i className="ion-android-document hide" />
      </div>
      <div className="col-3">
      </div>
    </div>;
  }
}