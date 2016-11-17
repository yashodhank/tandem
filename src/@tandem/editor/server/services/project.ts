import * as fs from "fs";

import {
  File,
  inject,
  loggable,
  document,
  Injector,
  filterAction,
  InjectorProvider,
  ApplicationServiceProvider,
} from "@tandem/common";
import { OpenProjectRequest, GetPrimaryProjectFilePathRequest } from "@tandem/editor/common";
import { IEdtorServerConfig } from "@tandem/editor/server/config";
import { CoreApplicationService } from "@tandem/core";

const tmpProjectFile = "/tmp/project.tdm";

@loggable()
export class ProjectService extends CoreApplicationService<IEdtorServerConfig> {
  private _primaryProjectPath: string;

  async [OpenProjectRequest.OPEN_PROJECT_FILE](action: OpenProjectRequest) {
    if (/\.tdm$/.test(action.filePath)) {
      this._primaryProjectPath = action.filePath;
    } else if (!this._primaryProjectPath) {
      fs.writeFileSync(tmpProjectFile, `<tdproject xmlns="tandem"><frame src="${action.filePath}" inherit-css /></tdproject>`);
      this._primaryProjectPath = tmpProjectFile;
    }
  }

  [GetPrimaryProjectFilePathRequest.GET_PRIMARY_PROJECT_FILE_PATH](action: GetPrimaryProjectFilePathRequest) {
    return this._primaryProjectPath;
  }
};
