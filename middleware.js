import {NextResponse} from "next/server";
export function middleware(request){
    const loginToken=request.cookies.get("tokenForCuvette")?.value;

    if(request.nextUrl.pathname === "/api/signin" ||
        request.nextUrl.pathname === "/api/users" ||
        request.nextUrl.pathname === "/api/signin/otpverify" ||
        request.nextUrl.pathname === "/api/users/checkuser" ||
        request.nextUrl.pathname === '/api/current' ||
        request.nextUrl.pathname === '/api/verification'||
        request.nextUrl.pathname === '/api/smsverify'){
        return
    }
    const loggedInUserNotAccessPaths = request.nextUrl.pathname ==="/signin" ||  request.nextUrl.pathname === '/signup' || request.nextUrl.pathname === '/' || request.nextUrl.pathname === '';
    if(loggedInUserNotAccessPaths){
        if(loginToken){
            return  NextResponse.redirect(new URL('/home',request.url));
        }
    }
    else{
        if(!loginToken){
            if(request.nextUrl.pathname.startsWith("/api")){
                return NextResponse.json({
                    message:"Access Denied!!!",
                    success:false
                },{
                    status:401
                })
            }
            return NextResponse.redirect(new URL('/signin',request.url));
        }
    }
}
export const config={
    matcher:['/','/signin','/signup','/api/:path*','/home','/posts','/newinterviewpost']
}