import * as Maki from './maki';

export const component = Maki.reducerComponent('Input');

export function initialState(props) {
  return { value: '' };
}

export function reducer(props, state, action) {
  switch (action.type) {
    case "UPDATE":
      return { ...state, value: action.value };
    default:
      return state;
  }
}

export function render(props, state, send) {
  return (
    <div>
      <label htmlFor={props.name}>
        {props.name}:
        <input name={props.name}
          type={props.type}
          value={state.value}
          onChange={(e) => send({ type: "UPDATE", value: e.target.value})} />
      </label>
      <p>Value: {state.value}</p>
    </div>
  );
}
