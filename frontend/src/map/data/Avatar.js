import axios from "axios";
import { random_int } from "../../Utils/Utils";

export default class Avatar {
  static i;

  avatars = [];

  constructor() {
    this.loadAvatars();
  }

  async loadAvatars() {
    await axios
      .get("/api/avatar/")
      .then((res) => {
        this.avatars = res.data.map((x) => {
          return x.file;
        });
      })
      .catch((err) => console.log(err));
  }

  //TODO IMPLEMENT
  getAvatarFor(race) {
    return this.avatars[random_int(0, this.avatars.length)];
  }
}
