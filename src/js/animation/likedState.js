const likedItemIds = new Set();

export function toggleLike(id) {
  if (likedItemIds.has(id)) {
    likedItemIds.delete(id);
    console.log('좋아요 취소:', likedItemIds); 
    return false;
  } else {
    likedItemIds.add(id);
    console.log('좋아요 추가:', likedItemIds); 
    return true;
  }
}

export function isLiked(id) {
  return likedItemIds.has(id);
}