
<script>

var req;
var params;
var url;

function requestParameterConstruction(){

	var quantity = Math.floor((Math.random() * 10) + 1;
	var duration = Math.floor((Math.random() * 10) + 1);
	var randInt = Math.floor((Math.random() * 10) + 1);
	var os_choice = ["android 4.0.0","android 4.0.4","android 4.1.1","android 4.1.2","android 4.1.3","android 4.1.4","android 4.1.5","android 4.2.2","android 4.2.4","android 4.3.4"];
	var mobile_os = os_choice[randInt];
	var ram_choice = ["256","512","1024","2048","4096"];
	var ram = ram_choice[Math.floor((Math.random() * 4))];
	var disk_choice = ["1024","2048","4096","8192"];
	var disk = ram_choice[Math.floor((Math.random() * 3))];
	var CPU_choice = ["Single 2GHz","Dual 1.2 GHz","Dual 1.4 GHz","Quad 1.2 GHz"];
	var CPU = ram_choice[Math.floor((Math.random() * 4))];

	var args = "quantity="+quantity+"&duration="+duration+"&mobile_os="+mobile_os+" &ram="+ram+"&disk="+disk+"&CPU="+CPU;

	return args;

}

function createRequestObject(){

	if (window.XMLHttpRequest) 
	{
		return new XMLHttpRequest();
	} 
	else 
	{
		if (window.ActiveXObject) 
		{
			return new ActiveXObject("Microsoft.XMLHTTP");
		}
	}
}

window.onload =function()
{
	for (i = 0; i < 100; i++) { 
    
		req = createRequestObject();
		url = "http://localhost:3030/resourceRequest";
		params = requestParameterConstruction();
		req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		req.onreadystatechange = printFunction();
		req.open("POST",url,true);
		req.send(params);
	}


}

function printFunction(){}



</script>