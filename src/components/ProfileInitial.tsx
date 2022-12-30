export const ProfileInitial = (props: { initial: string }) => {
  interface iColor {
    [key: string]: string | undefined;
  }

  const Color: any = {
    A: "#a0522d",
    B: "#cd5c5c",
    C: "#ffa07a",
    D: "#ffdab9",
    E: "#b0e0e6",
    F: "#f0ffff",
    G: "#f5f5dc",
    H: "#d3d3d3",
    I: "#c0c0c0",
    J: "#a9a9a9",
    K: "#808080",
    L: "#696969",
    M: "#778899",
    N: "#708090",
    O: "#2f4f4f",
    P: "#4682b4",
    Q: "#00bfff",
    R: "#87cefa",
    S: "#b0c4de",
    T: "#1e90ff",
    U: "#6495ed",
    V: "#7b68ee",
    W: "#4169e1",
    X: "#0000cd",
    Y: "#800080",
    Z: "#90ee90",
  };
  const name = props.initial.toUpperCase();
  const color = Color[name];
  const style = {
    backgroundColor: color,
  };
  return (
    <div className="profile-initial" style={style}>
      <span className="initial-letter">{name}</span>
    </div>
  );
};
