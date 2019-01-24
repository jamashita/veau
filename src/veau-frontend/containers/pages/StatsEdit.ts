import { connect, ConnectedComponentClass, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { Action } from '../../../declarations/Action';
import { State } from '../../../declarations/State';
import { Stats } from '../../../veau-entity/Stats';
import { LocaleRepository } from '../../../veau-repository/LocaleRepository';
import { Language } from '../../../veau-vo/Language';
import { Region } from '../../../veau-vo/Region';
import { Term } from '../../../veau-vo/Term';
import { StatsEdit as Component } from '../../components/pages/StatsEdit';

type StateProps = {
  stats: Stats;
  localeRepository: LocaleRepository;
};
type DispatchProps = {
  dataFilled: (row: number, col: number, value: number) => void;
  nameTyped: (name: string) => void;
  languageSelected: (language: Language) => void;
  regionSelected: (region: Region) => void;
  termSelected: (term: Term) => void;
};
type OwnProps = {
};
export type Props = StateProps & DispatchProps & OwnProps;

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state: State): StateProps => {
  const {
    stats,
    localeRepository
  } = state;

  return {
    stats,
    localeRepository
  };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch: Dispatch<Action>): DispatchProps => {
  return {
    dataFilled: (row: number, col: number, value: number): void => {
      console.log(`row ${row}, col ${col}, value ${value}`);
    },
    nameTyped: (name: string): void => {
      console.log(name);
    },
    languageSelected: (language: Language): void => {
      console.log(language.toString());
    },
    regionSelected: (region: Region): void => {
      console.log(region.toString());
    },
    termSelected: (term: Term): void => {
      console.log(term.toString());
    }
  };
};

export const StatsEdit: ConnectedComponentClass<any, any> = connect(mapStateToProps, mapDispatchToProps)(Component);
