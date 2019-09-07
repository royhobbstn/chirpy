import { connect } from "react-redux";
import Menu from "./Menu";
import { thunkLoadInitialData } from "./Redux/thunks";
import { clearData } from "./Redux/actions";

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    reloadData() {
      dispatch(clearData());
      dispatch(thunkLoadInitialData());
    }
  };
};

const MenuContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu);

export default MenuContainer;
