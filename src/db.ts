import { connect } from "mongoose";

export default () => connect(`${process.env.DB_URL}`, { useNewUrlParser: true, useUnifiedTopology: true });