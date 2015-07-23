<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <meta name="keywords" content="" />
    <meta name="description" content="" />
    <link href="../css/style.css" rel="stylesheet" type="text/css" media="all" />
    <link href='http://fonts.googleapis.com/css?family=Oswald:400,300' rel='stylesheet' type='text/css' />
    <link href='http://fonts.googleapis.com/css?family=Abel|Satisfy' rel='stylesheet' type='text/css' />
    <!--[if IE 6]>
    <link href="default_ie6.css" rel="stylesheet" type="text/css" />
    <![endif]-->
</head>
<body>
<div id="wrapper">
    <div id="header-wrapper">
        <?php echo $messages;?>
        <div id="header" class="container">
            <div id="logo">
                <h1><a href="#"><?php print $site_name;?></a></h1>
                <p><?php print $site_slogan;?></p>
            </div>
            <div id="menu">
                <?php print render($page['header_menu']);?>
            </div>
        </div>
    </div>
    <div id="page" class="container">
        <div id="banner"><!--<a href="#"><img src="images/img02.jpg" width="940" height="400" alt="" /></a>--></div>
        <div id="three-column">
            <div id="column1">
                <?php print render($page['block1']);?>
            </div>
            <div id="column2">
                <?php print render($page['block2']);?>
            </div>
            <div id="column3">
                <?php print render($page['block3']);?>
            </div>
        </div>
        <div id="content">
            <?php print render($page['content']);?>
        </div>
        <div id="sidebar">
            <?php print render($page['right_sidebar']);?>
        </div>
    </div>
</div>
<div id="footer">
    <p>Copyright (c) 2015</p>
</div>
</body>
</html>