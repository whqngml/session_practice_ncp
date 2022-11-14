const express = require("express");
const session = require("express-session");
const app = express();
const PORT = 8000;

app.set("view engine", "ejs");
app.use("/views", express.static(__dirname + "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: true,
    name: "practice-session",
  })
);

// (임시) DB에 저장되어 있는 유저정보
const userInfo = { id: "aa", pw: "qq" };

app.get("/", (req, res) => {
  console.log("req.session.user >>", req.session.user);
  // 세션 설정 X -> undefined
  // 세션 설정 O -> userInfo.id 값

  if (req.session.user !== undefined) {
    res.render("index", { isLogin: true, user: req.session.user });
  } else {
    res.render("index", { isLogin: false });
  }
  // 세션 값이 있으면, index.ejs render { isLogin: true, user: req.session.user }
  // 세션 값이 없으면, index.ejs render { isLogin: false }

  // res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

// POST /login
// 로그인 정보 일치: 세션설정
// 로그인 정보 불칠치: / 경로이동
app.post("/login", (req, res) => {
  console.log(req.body); // { id: 'a', pw: 'a' }
  console.log(req.body.id);
  console.log(req.body.pw);

  if (userInfo.id === req.body.id && userInfo.pw === req.body.pw) {
    // 로그인 정보 일치한다면
    // - req.session.user 저장
    req.session.user = req.body.id; // 세션설정
    // - / redirect
    res.redirect("/");

    // 폼에 입력한 아이디 = DB에서 찾은 아이디 &&
    // 폼에 입력한 비번 = DB에서 찾은 비번
  } else {
    // 로그인 정보 일치하지 않으면
    // - alret
    // - / 경로로 이동
    res.send(
      `<script>
      alert('로그인 실패..')
      document.location.href = '/'
      </script>`
    );
  }
});

// GET /logout
app.get("/logout", (req, res) => {
  // req.session.destroy((err) => {
  //   if (err) {
  //     throw err;
  //   }
  //   res.redirect("/");
  // });
  console.log("GET /logout | req.session.user >>", req.session.user);

  if (req.session.user !== undefined) {
    // req.session.destroy(콜백)
    // 콜백안에서 로그아웃 -> /리다이렉트
    req.session.destroy((err) => {
      if (err) {
        throw err;
      }
      res.redirect("/");
    });
  } else {
    // 유저가 브라우저에서 /logout 경로로 직접 접근
    // res.send()
    // - alert('잘못된 접근입니다.)
    // - / 경로로 이동
    res.send(
      `<script>
      alert('잘못된 접근입니다!!')
      document.location.href = '/'
      </script>`
    );
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

// req.session: '사용자별'로 해당 객체 안에 세션 정보 유지됨

// [세션쿠키 설정]
// req.session.키 = 값

// [세션쿠키 사용]
// req.session.키

// [세션 삭제]
// req.session.destroy(콜백함수)
// - 콜백함수: 세션 삭제시 호출할 콜백함수
