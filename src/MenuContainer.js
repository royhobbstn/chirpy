import { connect } from "react-redux";
import Menu from "./Menu";
import { thunkLoadInitialData } from "./Redux/thunks";

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    reloadData() {
      dispatch(thunkLoadInitialData());
    }
  };
};

const MenuContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu);

export default MenuContainer;
