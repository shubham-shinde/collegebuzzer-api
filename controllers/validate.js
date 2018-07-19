export default {
    post : _post
}

function _post (req, res) {

    req.checkBody("year", 'invalid credentials').isInt({min: 0, max: 4})
    req.checkBody("type", 'invalid credentials').isUppercase().isLength(1).isIn(['R','L','B'])
    req.checkBody("section", 'invalid credentials').isUppercase().isLength(1).isIn(['A','B'])
    req.checkBody("rollno", 'invalid credentials').isNumeric().isLength(10)
    req.checkBody("branch", 'invalid credentials').isLength(2)
    req.checkBody("gender", 'invalid credentials').isUppercase().isLength(1).isIn(['M','F'])
    req.checkBody("f_name", 'invalid credentials').isAlpha()
    req.checkBody("l_name", 'invalid credentials').isAlpha()
    req.checkBody("b_year", 'invalid credentials').isInt({min: 1990, max: 2010})
    req.checkBody("b_date", 'invalid credentials').isInt({min: 0, max: 31})
    req.checkBody("b_month", 'invalid credentials').isInt({min: 0, max: 11})
    req.checkBody("m_no", 'invalid credentials').isMobilePhone('en-IN')
    req.checkBody("mail", 'invalid credentials').isEmail()
    req.checkBody("h_town", 'invalid credentials').isAlpha() 

    var errors = req.validationErrors();
    if (errors) {
        res.json({error: errors});
        return;
    }
    else {
        res.json({msg: 'done'})
    }
}