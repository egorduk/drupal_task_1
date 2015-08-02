<div id="product-<?php print $product->id; ?>" class="<?php print $classes; ?> clearfix"<?php print $attributes; ?>>

<?php print render($title_prefix); ?>
<?php if (!$page): ?>
<h2<?php print $title_attributes; ?>><?php print $title; ?></h2>
<?php endif; ?>
<?php print render($title_suffix); ?>

<div class="submitted">
    <?php print $submitted; ?>
</div>

<div class="content"<?php print $content_attributes; ?>>
<?php print render($content); ?>
</div>

</div>