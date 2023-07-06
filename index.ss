set one = 1;
lock too = true;

fun check(x, y){
    out(x, y)
}

if(one == too){
    check(one, too)
    out("1 equals 1!")
} else {
    out("1 dosen't equal 1!")
}