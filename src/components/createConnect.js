import createStoreShape from '../utils/createStoreShape';
import shallowEqual from '../utils/shallowEqual';
import isPlainObject from '../utils/isPlainObject';
import wrapActionCreators from '../utils/wrapActionCreators';
import hoistStatics from 'hoist-non-react-statics';
import invariant from 'invariant';

const defaultMapStateToProps = () => ({});
const defaultMapDispatchToProps = dispatch => ({ dispatch });
const defaultMergeProps = (stateProps, dispatchProps, parentProps) => ({
  ...parentProps,
  ...stateProps,
  ...dispatchProps
});

function getDisplayName(Component) {
  return Component.displayName || Component.name || 'Component';
}

// Helps track hot reloading.
let nextVersion = 0;

export default function createConnect(React) {
  const { Component, PropTypes } = React;
  const storeShape = createStoreShape(PropTypes);

  return function connect(mapStateToProps, mapDispatchToProps, mergeProps, options = {}) {
    const shouldSubscribe = Boolean(mapStateToProps);
    const finalMapStateToProps = mapStateToProps || defaultMapStateToProps;
    const finalMapDispatchToProps = isPlainObject(mapDispatchToProps) ?
      wrapActionCreators(mapDispatchToProps) :
      mapDispatchToProps || defaultMapDispatchToProps;
    const finalMergeProps = mergeProps || defaultMergeProps;
    const shouldUpdateStateProps = finalMapStateToProps.length > 1;
    const shouldUpdateDispatchProps = finalMapDispatchToProps.length > 1;
    const { pure = true } = options;

    // Helps track hot reloading.
    const version = nextVersion++;

    function computeStateProps(store, props) {
      const state = store.getState();
      const stateProps = shouldUpdateStateProps ?
        finalMapStateToProps(state, props) :
        finalMapStateToProps(state);

      invariant(
        isPlainObject(stateProps),
        '`mapStateToProps` must return an object. Instead received %s.',
        stateProps
      );
      return stateProps;
    }

    function computeDispatchProps(store, props) {
      const { dispatch } = store;
      const dispatchProps = shouldUpdateDispatchProps ?
        finalMapDispatchToProps(dispatch, props) :
        finalMapDispatchToProps(dispatch);

      invariant(
        isPlainObject(dispatchProps),
        '`mapDispatchToProps` must return an object. Instead received %s.',
        dispatchProps
      );
      return dispatchProps;
    }

    function computeNextState(stateProps, dispatchProps, parentProps) {
      const mergedProps = finalMergeProps(stateProps, dispatchProps, parentProps);
      invariant(
        isPlainObject(mergedProps),
        '`mergeProps` must return an object. Instead received %s.',
        mergedProps
      );
      return mergedProps;
    }

    return function wrapWithConnect(WrappedComponent) {
      class Connect extends Component {

        shouldComponentUpdate(nextProps, nextState) {
          if (!pure) {
            this.updateStateProps(nextProps);
            this.updateDispatchProps(nextProps);
            this.updateState(nextProps);
            return true;
          }

          const storeChanged = nextState.storeState !== this.state.storeState;
          const propsChanged = !shallowEqual(nextProps, this.props);
          let mapStateProducedChange = false;
          let dispatchPropsChanged = false;

          if (storeChanged || (propsChanged && shouldUpdateStateProps)) {
            mapStateProducedChange = this.updateStateProps(nextProps);
          }

          if (propsChanged && shouldUpdateDispatchProps) {
            dispatchPropsChanged = this.updateDispatchProps(nextProps);
          }

          if (propsChanged || mapStateProducedChange || dispatchPropsChanged) {
            this.updateState(nextProps);
            return true;
          }

          return false;
        }

        constructor(props, context) {
          super(props, context);
          this.version = version;
          this.store = props.store || context.store;

          invariant(this.store,
            `Could not find "store" in either the context or ` +
            `props of "${this.constructor.displayName}". ` +
            `Either wrap the root component in a <Provider>, ` +
            `or explicitly pass "store" as a prop to "${this.constructor.displayName}".`
          );

          this.stateProps = computeStateProps(this.store, props);
          this.dispatchProps = computeDispatchProps(this.store, props);
          this.state = { storeState: null };
          this.updateState();
        }

        computeNextState(props = this.props) {
          return computeNextState(
            this.stateProps,
            this.dispatchProps,
            props
          );
        }

        updateStateProps(props = this.props) {
          const nextStateProps = computeStateProps(this.store, props);
          if (shallowEqual(nextStateProps, this.stateProps)) {
            return false;
          }

          this.stateProps = nextStateProps;
          return true;
        }

        updateDispatchProps(props = this.props) {
          const nextDispatchProps = computeDispatchProps(this.store, props);
          if (shallowEqual(nextDispatchProps, this.dispatchProps)) {
            return false;
          }

          this.dispatchProps = nextDispatchProps;
          return true;
        }

        updateState(props = this.props) {
          this.nextState = this.computeNextState(props);
        }

        isSubscribed() {
          return typeof this.unsubscribe === 'function';
        }

        trySubscribe() {
          if (shouldSubscribe && !this.unsubscribe) {
            this.unsubscribe = this.store.subscribe(::this.handleChange);
            this.handleChange();
          }
        }

        tryUnsubscribe() {
          if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
          }
        }

        componentDidMount() {
          this.trySubscribe();
        }

        componentWillUnmount() {
          this.tryUnsubscribe();
        }

        handleChange() {
          if (!this.unsubscribe) {
            return;
          }

          this.setState({
            storeState: this.store.getState()
          });
        }

        getWrappedInstance() {
          return this.refs.wrappedInstance;
        }

        render() {
          return (
            <WrappedComponent ref='wrappedInstance'
                              {...this.nextState} />
          );
        }
      }

      Connect.displayName = `Connect(${getDisplayName(WrappedComponent)})`;
      Connect.WrappedComponent = WrappedComponent;
      Connect.contextTypes = {
        store: storeShape
      };
      Connect.propTypes = {
        store: storeShape
      };

      if (process.env.NODE_ENV !== 'production') {
        Connect.prototype.componentWillUpdate = function componentWillUpdate() {
          if (this.version === version) {
            return;
          }

          // We are hot reloading!
          this.version = version;

          // Update the state and bindings.
          this.trySubscribe();
          this.updateStateProps();
          this.updateDispatchProps();
          this.updateState();
        };
      }

      return hoistStatics(Connect, WrappedComponent);
    };
  };
}
