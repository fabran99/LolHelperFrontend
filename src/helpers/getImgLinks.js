export const getSquare = (img_dict, champ) => {
  return img_dict.champ_square.replace("$champ_key$", champ);
};

export const getSplash = (img_dict, champ, skin_id) => {
  skin_id = skin_id || "0";
  return img_dict.champ_splashart
    .replace("$champ_key$", champ)
    .replace("$skin_id$", skin_id);
};

export const getLoading = (img_dict, champ, skin_id) => {
  skin_id = skin_id || "0";

  return img_dict.champ_loading
    .replace("$champ_key$", champ)
    .replace("$skin_id$", skin_id);
};

export const getItem = (img_dict, item) => {
  return img_dict.item_img.replace("$item_id$", item);
};

export const getIcon = (img_dict, icon) => {
  return img_dict.icon_img.replace("$icon_id$", icon);
};

export const getSpell = (img_dict, spell) => {
  return img_dict.spell_img.replace("$spell_id$", spell);
};
