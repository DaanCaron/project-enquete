exports.id = 250;
exports.ids = [250];
exports.modules = {

/***/ 4178:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6764);
/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);


function App({ Component, pageProps }) {
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Component, {
        ...pageProps
    });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (App);


/***/ }),

/***/ 1230:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const getQuestionBySequenceAndSurveyId = async (sequence, survey)=>{
    return await fetch(`${"http://192.168.0.132:8000"}/question/${survey}/${sequence}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
};
const getAllQuestions = async ()=>{
    return await fetch(`${"http://192.168.0.132:8000"}/question/all`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
};
const getAllQuestionsBysurveyId = async (survey)=>{
    return await fetch(`${"http://192.168.0.132:8000"}/question/${survey}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
};
const changeQuestion = async (question)=>{
    return await fetch(`${"http://192.168.0.132:8000"}/question/update/${question.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(question)
    });
};
const createQuestion = (question, surveyId)=>{
    return fetch(`${"http://192.168.0.132:8000"}/survey/${surveyId}/question`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(question)
    });
};
const removeQuestion = (qid)=>{
    return fetch(`${"http://192.168.0.132:8000"}/question/remove/${qid}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
};
const castVote = (qid, vote, weight)=>{
    return fetch(`${"http://192.168.0.132:8000"}/question/vote/${qid}/${vote}/${weight}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    getQuestionBySequenceAndSurveyId,
    getAllQuestions,
    getAllQuestionsBysurveyId,
    changeQuestion,
    createQuestion,
    removeQuestion,
    castVote
});


/***/ }),

/***/ 6764:
/***/ (() => {



/***/ })

};
;