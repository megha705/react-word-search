import * as React from "react";
import * as fetch from "isomorphic-fetch";
import { config } from "./config";
import { WordsearchInput } from "../lib/wordsearch/wordsearch";
import { Board } from "./components/board";
import { Button, Grid } from "@material-ui/core";
import { SettingsReduxForm } from "./components/settings.form";
import { connect } from "react-redux";
import { gameActionCreators } from "./redux/game.actions";
import { GameStoreState } from "./game.types";

interface GameProps {
  gameState: GameStoreState;
  newGame: () => void;
  setConfig: (wsConfig: Partial<WordsearchInput>) => void;
}

class GameClass extends React.Component<GameProps> {
  componentDidMount() {
    this.loadDictionary();
  }

  loadDictionary = async () => {
    try {
      const response = await fetch(config.api + "ws/dictionary");
      const words = await response.json();
      this.props.setConfig({
        wordsConfig: {
          amount: 20,
          dictionary: words
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    if (this.props.newGame && this.props.gameState) {
      const { newGame, gameState } = this.props;
      return (
        <Grid container>
          <Grid item xs={12}>
            <Button
              color={"primary"}
              size={"small"}
              variant={"contained"}
              onClick={newGame}
            >
              New Game
            </Button>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Board {...gameState.current.game} />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <SettingsReduxForm />
          </Grid>
        </Grid>
      );
    } else {
      return <p>Loading...</p>;
    }
  }
}

const mapStateToProps = (state, props) => {
  return {
    ...props,
    gameState: state.reducers.GameReducer
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setConfig: async (wsConfig: Partial<WordsearchInput>) => {
      dispatch(gameActionCreators.setConfig(wsConfig));
    },
    newGame: async () => {
      dispatch(gameActionCreators.create());
    }
  };
};

export const Game = connect(
  mapStateToProps,
  mapDispatchToProps
)(GameClass);
