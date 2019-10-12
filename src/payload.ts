export const preparePayload = (result: any, setNoTimestamp?: boolean) => {
  var payLoad = [] as any[];
  var dateInNanoSecond = Date.now() * 1000000;
  result.top.map((element: any) => {
    payLoad.push({
      game: element.game.name,
      viewerCount: element.viewers,
      timestamp: setNoTimestamp === undefined ? dateInNanoSecond : 0
    });
  });
  return payLoad;
};
