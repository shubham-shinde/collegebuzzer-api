import path from 'path';
export default {
    get : _get
}



function _get(req, res) {
    res.render(path.join(__dirname,'..','static', 'index.html'))
}