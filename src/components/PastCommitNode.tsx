import * as React from 'react';
import { classes } from 'typestyle';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import { GitExtension } from '../model';
import { Git } from '../tokens';
import {
  branchWrapperClass,
  branchClass,
  collapseIconButtonClass,
  commitBodyClass,
  commitExpandedClass,
  commitHeaderClass,
  commitHeaderItemClass,
  commitWrapperClass,
  expandIconButtonClass,
  iconButtonClass,
  localBranchClass,
  remoteBranchClass,
  workingBranchClass
} from '../style/PastCommitNode';
import { SinglePastCommitInfo } from './SinglePastCommitInfo';

/**
 * Interface describing component properties.
 */
export interface IPastCommitNodeProps {
  /**
   * Commit data.
   */
  commit: Git.ISingleCommitInfo;

  /**
   * List of branches.
   */
  branches: Git.IBranch[];

  /**
   * Extension data model.
   */
  model: GitExtension;

  /**
   * Render MIME type registry.
   */
  renderMime: IRenderMimeRegistry;
}

/**
 * Interface describing component state.
 */
export interface IPastCommitNodeState {
  /**
   * Boolean indicating whether additional commit information should be displayed.
   */
  expanded: boolean;
}

/**
 * React component for rendering an individual commit.
 */
export class PastCommitNode extends React.Component<
  IPastCommitNodeProps,
  IPastCommitNodeState
> {
  /**
   * Returns a React component for rendering an individual commit.
   *
   * @param props - component properties
   * @returns React component
   */
  constructor(props: IPastCommitNodeProps) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  /**
   * Renders the component.
   *
   * @returns React element
   */
  render(): React.ReactElement {
    return (
      <li
        className={classes(
          commitWrapperClass,
          this.state.expanded ? commitExpandedClass : null
        )}
        onClick={this._onCommitClick}
      >
        <div className={commitHeaderClass}>
          <span className={commitHeaderItemClass}>
            {this.props.commit.author}
          </span>
          <span className={commitHeaderItemClass}>
            {this.props.commit.commit.slice(0, 7)}
          </span>
          <span className={commitHeaderItemClass}>
            {this.props.commit.date}
          </span>
          <span
            className={classes(
              iconButtonClass,
              this.state.expanded
                ? collapseIconButtonClass
                : expandIconButtonClass,
              'jp-Icon-16'
            )}
          />
        </div>
        <div className={branchWrapperClass}>{this._renderBranches()}</div>
        <div className={commitBodyClass}>
          {this.props.commit.commit_msg}
          {this.state.expanded && (
            <SinglePastCommitInfo
              commit={this.props.commit}
              model={this.props.model}
              renderMime={this.props.renderMime}
            />
          )}
        </div>
      </li>
    );
  }

  /**
   * Renders branch information.
   *
   * @returns array of React elements
   */
  private _renderBranches(): React.ReactElement[] {
    const curr = this.props.commit.commit;
    const branches: Git.IBranch[] = [];
    for (let i = 0; i < this.props.branches.length; i++) {
      const branch = this.props.branches[i];
      if (branch.top_commit && branch.top_commit === curr) {
        branches.push(branch);
      }
    }
    return branches.map(this._renderBranch, this);
  }

  /**
   * Renders individual branch data.
   *
   * @param branch - branch data
   * @returns React element
   */
  private _renderBranch(branch: Git.IBranch): React.ReactElement {
    return (
      <React.Fragment key={branch.name}>
        {branch.is_current_branch && (
          <span className={classes(branchClass, workingBranchClass)}>
            working
          </span>
        )}
        <span
          className={classes(
            branchClass,
            branch.is_remote_branch ? remoteBranchClass : localBranchClass
          )}
        >
          {branch.name}
        </span>
      </React.Fragment>
    );
  }

  /**
   * Callback invoked upon clicking on an individual commit.
   *
   * @param event - event object
   */
  private _onCommitClick = (): void => {
    this.setState({
      expanded: !this.state.expanded
    });
  };
}
