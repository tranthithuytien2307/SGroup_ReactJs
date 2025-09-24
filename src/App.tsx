import LoginPage from "./modules/LoginPage";

function App() {
  return (
    <div className="w-full">
      <LoginPage></LoginPage>
      <p>
        Khi dữ liệu thay đổi (ví dụ thêm, xoá, reorder), React dùng key để biết
        phần tử nào giữ nguyên, phần tử nào cần thêm/xoá/cập nhật, giúp tránh
        re-render sai.
      </p>
    </div>
  );
}

export default App;
