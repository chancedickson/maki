import React from "react";

const cache = new Map();

const reducerSymbol = Symbol("reducerComponent");
const statelessSymbol = Symbol("statelessSymbol");

export const reducerComponent = makeFactory(reducerSymbol);
export const statelessComponent = makeFactory(statelessSymbol);

function makeFactory(type) {
  return name => ({ name, type });
}

function makeComponent(module) {
  if (!module.component) {
    throw "Must have component export on module.";
  }

  if (!module.render) {
    throw "Must have render export on module.";
  }

  if (module.component.type === statelessSymbol) {
    const { component, render } = module;
    Object.defineProperty(render, "name", { value: component.name });
    return render;
  }

  if (!module.initialState) {
    throw "Must have initialState export on reducer component module.";
  }

  if (!module.reducer) {
    throw "Must have reducer export on reducer component module.";
  }

  function constructor(props) {
    React.Component.call(this, props);

    this.state = module.initialState(props);

    this.self = {
      props: this.props,
      state: this.state,
      send: action => {
        this.setState(state => module.reducer(this.props, state, action));
      }
    };
  }

  Object.defineProperty(constructor, "name", { value: module.component.name });

  constructor.prototype = Object.create(React.Component.prototype);

  constructor.prototype.render = function render() {
    return module.render(this.self);
  };

  if (module.didMount) {
    constructor.prototype.componentDidMount = function componentDidMount() {
      module.didMount(this.self);
    };
  }

  if (module.shouldUpdate) {
    constructor.prototype.shouldComponentUpdate = function shouldComponentUpdate(
      nextProps,
      nextState
    ) {
      return module.shouldUpdate(this.props, this.state, nextProps, nextState);
    };
  }

  if (module.didUpdate) {
    constructor.prototype.componentDidUpdate = function componentDidUpdate(
      prevProps,
      prevState
    ) {
      return module.didUpdate(this.props, this.state, prevProps, prevState);
    };
  }

  if (module.willUnmount) {
    constructor.prototype.componentWillUnmount = function componentWillUnmount() {
      return module.willUnmount(this.props, this.state);
    };
  }

  if (module.didCatch) {
    constructor.prototype.componentDidCatch = function componentDidCatch(
      error,
      info
    ) {
      return module.didCatch(this.props, this.state, this.send, error, info);
    };
  }

  return constructor;
}

function getComponent(module) {
  const cached = cache.get(module);
  if (cached) {
    return cached;
  }

  const component = makeComponent(module);
  cache.set(module, component);
  return component;
}

export function createElement(module, props, ...children) {
  return React.createElement(
    typeof module === "object" && module.__esModule
      ? getComponent(module)
      : module,
    props,
    ...children
  );
}
