type title = {
    text: string;
    className: string;
    onClick?: () => void;
  };
  
  export default function Title(props: title) {
    return <p className={props.className}>{props.text}</p>;
  }