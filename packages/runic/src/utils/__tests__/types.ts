export type SimpleState = {
  x: number;
};

export type Vector3 = {
  x: number;
  y: number;
  z: number;
};

export type User = {
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
};
