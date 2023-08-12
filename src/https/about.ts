import instance from "./request";

export default{
    // /关于我们
    postabout(represent:any='about_us'){
        return instance.post('api/public/auxiliary_content.php/get',{
            represent
        })
    }
}