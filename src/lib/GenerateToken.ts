    
    export function generate_token(length: number){
        let a = "abcdefghijklmnopqrstuvwxyz1234567890".split("");
        let b = [];  
        for (let i=0; i<length; i++) {
            let j: any = (Math.random() * (a.length-1)).toFixed(0);
            b[i] = a[j];
        }
        return b.join("");
    }
    
    export function generateNumericToken(length: number){
        let a = "123456789".split("");
        let b = [];  
        for (let i=0; i<length; i++) {
            let j: any = (Math.random() * (a.length-1)).toFixed(0);
            b[i] = a[j];
        }
        return Number(b.join(""));
    }