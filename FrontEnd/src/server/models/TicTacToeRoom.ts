import { InferSchemaType, Model, Schema, Types, model, models } from "mongoose";

const ticTacToeRoomSchema = new Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    board: {
      type: [Schema.Types.Mixed],
      default: Array(9).fill(null),
    },
    currentPlayer: {
      type: String,
      default: null,
    },
    players: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export type TicTacToeRoomDocument = InferSchemaType<
  typeof ticTacToeRoomSchema
> & {
  _id: Types.ObjectId;
};

export const TicTacToeRoomModel =
  (models.TicTacToeRoom as Model<TicTacToeRoomDocument>) ||
  model<TicTacToeRoomDocument>("TicTacToeRoom", ticTacToeRoomSchema);
