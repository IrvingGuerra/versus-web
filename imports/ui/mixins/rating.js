export default {
    methods: {
        getIconType(star, rating) {
            let result;
            let integer = parseInt(rating);
            let decimal = rating - integer;
            if (star === Math.round(rating) && decimal >= 0.5) {
                result = "star-half";
            } else {
                result = "star";
            }
            return result;
        }
    }
}