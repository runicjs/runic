export type SimpleState = {
  x: number;
};

export type Vector3State = {
  x: number;
  y: number;
  z: number;
};

export type UserState = {
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
};
