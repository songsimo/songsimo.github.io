/**
 * 아주 작은 상태 저장소.
 *
 * "사용자 이벤트 → 상태 변경(set) → 화면 업데이트(render)" 흐름을 한 곳에 모은다.
 * 이벤트 핸들러는 DOM을 직접 만지지 않고 set만 부르고,
 * DOM을 바꾸는 일은 render 함수 한 곳에서만 한다.
 * React의 useState가 하는 일의 가장 단순한 형태다.
 */
export const createStore = (initialState, render) => {
  let state = initialState;

  const get = () => state;

  const set = patch => {
    state = { ...state, ...patch };
    render(state);
  };

  render(state); // 처음 상태도 같은 render로 그린다
  return { get, set };
};