var streamingType = 0;

function getURLContent(url2call, requestString, processReqChange)
{
    xmlhttp=new XMLHttpRequest();

    xmlhttp.open('GET', url2call, true);
    
	xmlhttp.onreadystatechange=function() 
	{
		if(xmlhttp.readyState === 4)
		{
			if(xmlhttp.status === 200) 
			{
				processReqChange(xmlhttp.responseText);
			}
			else
				alert('Error. Status: ' + xmlhttp.status);
		}
	}
    xmlhttp.send(requestString);
}
