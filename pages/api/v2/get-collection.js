import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as Strings from "~/common/strings";
import * as Powergate from "~/node_common/powergate";
import * as RequestUtilities from "~/node_common/request-utilities";

export default async (req, res) => {
  const userInfo = await RequestUtilities.checkAuthorizationExternal(req, res);
  if (!userInfo) return;
  const { id, key, user } = userInfo;

  let slateId = req.body?.data?.id;
  let slate;

  if (Strings.isEmpty(slateId)) {
    return res.status(400).send({ decorator: "NO_ID_PROVIDED", error: true });
  }

  slate = await Data.getSlateById({ id: slateId, includeFiles: true, sanitize: true });

  if (!slate) {
    return res.status(404).send({
      decorator: "COLLECTION_NOT_FOUND",
      error: true,
    });
  }

  if (slate.error) {
    return res.status(500).send({
      decorator: "ERROR_WHILE_LOCATING_COLLECTION",
      error: true,
    });
  }

  if (!slate.isPublic) {
    return res.status(400).send({
      decorator: "COLLECTION_IS_PRIVATE",
      error: true,
    });
  }

  return res.status(200).send({ decorator: "GET_COLLECTION", collection: slate });
};
