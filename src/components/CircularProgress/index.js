import { CircularProgress } from "@material-ui/core";

const Circular = () => {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        heght: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </div>
  );
};

export default Circular;
