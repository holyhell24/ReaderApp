import { ReactReaderStyle } from "react-reader";

export const readerStyles = {
  ...ReactReaderStyle,
  container: {
    ...ReactReaderStyle.container,
    height: "100%",
    position: "relative" as const,
  },
  readerArea: {
    ...ReactReaderStyle.readerArea,
    backgroundColor: "#fff",
  },
  titleArea: {
    ...ReactReaderStyle.titleArea,
    display: "none",
  },
  tocButton: {
    ...ReactReaderStyle.tocButton,
    display: "none",
  },
  reader: {
    ...ReactReaderStyle.reader,
    top: 0,
    bottom: 0,
    left: -44,
    right: -44,
  },
  arrow: {
    ...ReactReaderStyle.arrow,
    alignItems: "center",
    appearance: "none" as const,
    background: "transparent",
    color: "transparent",
    display: "flex",
    fontSize: 40,
    height: "100%",
    top: 0,
    width: 44,
    zIndex: 10,
  },
};
