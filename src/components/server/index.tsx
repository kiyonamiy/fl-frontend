import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { State } from '../../types';
import { createDispatchHandler, ActionHandler } from "../../actions/redux-action";
import { SpaceAction, ModelAction } from '../../actions';

import serverSvg from '../../assets/icons/server.svg';
export interface ServerProps {
  curRound: number,
};
function ServerPaneBase(props: ServerProps): JSX.Element {
  return (  
    <div className='Frame ServerView'>
      <div className='title'>
        <img src={serverSvg} className='svg-class'></img>
        <p>SERVER</p>
      </div>
    </div>
  );
}

const mapStateToProps = (state: State) => ({
  curRound: state.Space.round,
});
export const ServerPane = connect(
  mapStateToProps,
  createDispatchHandler<SpaceAction | ModelAction>()
)(ServerPaneBase);
