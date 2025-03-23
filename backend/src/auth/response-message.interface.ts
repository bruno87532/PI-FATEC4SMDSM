export interface ResponseMessage {
  message: string;
  statusCode: number;
}

export interface ResponseMessageIdUser extends ResponseMessage {
  idUser: string;
}