import "./index.scss";

import * as React from "react";
import * as cx from "classnames";
import * as electron from "electron";
import { FileInputComponent } from "@tandem/uikit";
import { AlertMessage } from "@tandem/editor/browser";
import { TandemStudioBrowserStore } from "tandem-studio/browser/stores";
import { BaseApplicationComponent, inject } from "@tandem/common";
import { TandemStudioBrowserStoreProvider } from "tandem-studio/browser/providers";
import { RedirectRequest, createWorkspaceRedirectRequest } from "@tandem/editor/browser/messages";
import { RouteNames } from "@tandem/editor/browser/constants";
import { 
  IHelpOption,
  IStarterOption,
  OpenWorkspaceRequest, 
  SelectDirectoryRequest,
  OpenHelpOptionRequest, 
  StartNewProjectRequest, 
  OpenGettingStartedProjectRequest, 
} from "tandem-studio/common";

// TODO - scan application directory for VSCode, and display "install extension" button if not already installed
export class WelcomeComponent extends BaseApplicationComponent<{ store?: TandemStudioBrowserStore }, { selectedStarterOption: IStarterOption, cwd?: string }> {

  state = {
    selectedStarterOption: undefined,
    cwd: process.cwd()
  };

  @inject(TandemStudioBrowserStoreProvider.ID)
  private _store: TandemStudioBrowserStore;

  getStarted = () => {
    this.bus.dispatch(new OpenGettingStartedProjectRequest());
  }

  joinNewsLetter = () => {

  }

  close = () => {

  }

  // TODO
  installExtension = (name) => {

  }

  selectStarterOption = (option) => {
    this.setState({ selectedStarterOption: option });
  }

  onOpenExistingProject = async (event: React.SyntheticEvent<any>) => {
    const file = event.currentTarget.files[0] as File;
    this.redirectToWorkspace(file.path);
  }
  

  async redirectToWorkspace(filePath: string) {   
    const w = 1024;
    const h = 768;
    window.moveTo(window.screen.width / 2 - w / 2, window.screen.height / 2 - h / 2);
    window.resizeTo(w, h);
    await this.bus.dispatch(createWorkspaceRedirectRequest(filePath));
  }

  startNewDocument = async () => {
    try {
      await this.redirectToWorkspace(await StartNewProjectRequest.dispatch(this.state.selectedStarterOption, this.state.cwd, this.bus));
    } catch(e) {
      this.bus.dispatch(AlertMessage.createErrorMessage(`Cannot start project: ${e.stack}`));
    }
  }
  
  openHelpOption = async (option: IHelpOption) => {
    await this.bus.dispatch(new OpenHelpOptionRequest(option));
    window.close();
  }

  selectDirectory = async () => {
    this.setState({
      selectedStarterOption: this.state.selectedStarterOption,
      cwd: await SelectDirectoryRequest.dispatch(this.bus)
    });
  }

  render() {
    
    console.log(this._store.helpOptions);
    return <div className="welcome">
      <div className="info">
        <i className="ion-close hide" onClick={this.close}></i>
        <h2 className="header">Welcome to Tandem</h2>

        <ul>
          {
            this._store.helpOptions.filter((option) => option.page === "welcome").map((option) => {
              return <li key={option.id}><a href="#" onClick={this.openHelpOption.bind(this, option)}>{ option.label }</a></li>;
            })
          }
          <li className="hide"><a href="#" onClick={this.joinNewsLetter}>Join newsletter</a></li>
          <li className="hide"><a href="#" onClick={this.installExtension.bind(this, "vscode")}>Install VSCode Extension</a></li>
        </ul>
      </div>
      { this.state.selectedStarterOption ? this.renderSelectedStarterOption() : this.renderStarterOptions() }
    </div>;
  }

  renderSelectedStarterOption() {
    return <div className="rightbar">
      <div className="directory-options">
        <div className="row">
          <div className="col-4">
            Select a directory:
          </div>
        </div>
        <div className="row">
          <div className="col-8">
            <input type="text" value={this.state.cwd} />
          </div>
          <div className="col-2">
            <a href="#" className="button" onClick={this.selectDirectory}>browser</a>
          </div>
          <div className="col-2">
          </div>
        </div>
      </div>
      <div className="footer">
        <a href="#" className="button pull-right" onClick={this.startNewDocument.bind(this)}>Start Project</a>
      </div>
    </div>
  }

  renderStarterOptions() {
    return <div className="rightbar">
      <div className="options">

        <h2 className="header">Start a New Project</h2>

        <ul>
          { (this.props.store || this._store).projectStarterOptions.map((option, index) => {
            return <li key={index}>
              <div className={cx({ inner: true, disable: !option.enabled })} onClick={option.enabled && this.selectStarterOption.bind(this, option)}>
                <div className="image" style={{ backgroundImage: `url(${option.image})` }} />
                <div className="label">
                  { option.label }
                </div>
              </div>
            </li>;
          }) }
        </ul>

      </div>
      <div className="footer">
        <FileInputComponent accept=".tandem" label="Open existing project" onChange={this.onOpenExistingProject} />
      </div>
    </div>
  }
}