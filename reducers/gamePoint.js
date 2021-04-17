let initialState = {
playerPoint:0,
computerPoint:0,
drawPoint:0,
sound:true
}
export default function (state = initialState, action) {
    switch (action.type) {
        case "PlayerPoint": initialState.playerPoint++;
            break;
         case "ComputerPoint": initialState.computerPoint++;
            break;
         case "DrawPoint": initialState.drawPoint++;
         break;
         case "ChangeSound": initialState.sound=!initialState.sound;
         break;
    }
    console.log(initialState,"fsdfsdf")
    return initialState;
}