<div id="products-pager">
    <?php foreach ($urls as $url): ?>
        <span>
            <a target="_blank" href="http://<?php echo $url->url; ?>"><?php echo $url->url; ?></a><br>
        </span>
    <?php endforeach; ?>
</div>