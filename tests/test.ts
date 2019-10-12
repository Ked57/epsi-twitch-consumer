import test from "ava";
import { preparePayload } from "../src/payload";

test("Payload format is respected", async t => {
  const result = preparePayload(input, true);
  t.deepEqual(result, excepted);
});

const input: any = {
  top: [
    {
      game: {
        name: "firstGame"
      },
      viewers: 50
    },
    {
      game: {
        name: "secondGame"
      },
      viewers: 10
    }
  ]
};
const excepted: any = [
  {
    game: "firstGame",
    viewerCount: 50,
    timestamp: 0
  },
  {
    game: "secondGame",
    viewerCount: 10,
    timestamp: 0
  }
];
