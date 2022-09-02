class Member{
    Member(name, start_date, major, grad_year){
        this.name = name;
        this.start_date = start_date;
        this.major = major;
        this.grad_year = grad_year;
    
        this.getName = function(){
            return this.name;
        }
        this.getStart = function(){
            return this.start_date;
        }
        this.getMajor = function(){
            return this.major;
        }
        this.getGradYear = function(){
            return this.grad_year;
        }
    }
}

module.exports = Member;