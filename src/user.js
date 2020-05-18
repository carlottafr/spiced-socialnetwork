export default function userInfo(obj) {
    let user = {
        id: obj.id,
        first: obj.first,
        last: obj.last,
        image: obj.image,
        bio: obj.bio,
    };
    return user;
}
