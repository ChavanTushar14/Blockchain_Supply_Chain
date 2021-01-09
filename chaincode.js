const Contract=require("fabric-contract-api")

class example extends Contract{
    async readMyAsset(ctx, myAssetId) {

        const exists = await this.myAssetExists(ctx, myAssetId);
    
        if (!exists) {
          // throw new Error(`The my asset ${myAssetId} does not exist`);
          let response = {};
          response.error = `The my asset ${myAssetId} does not exist`;
          return response;
        }
    
        const buffer = await ctx.stub.getState(myAssetId);
        const asset = JSON.parse(buffer.toString());
        return asset;
      }
}