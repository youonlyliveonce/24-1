<?php
	$itemtags = $item->filtertags()->split(',');
?>
<div class="Portfolio__item <?= $itemclass ?>[<?php foreach($itemtags as $tag){ echo " ".$tag; } ?> ]">
	<a href="/<?= $site->language() ?>/<?= $item->uri() ?>">
		<?php if($thumb == 'square'): ?>
			<?= thumb($item->teaserimage()->toFile(), array('width' => 400, 'height' => 400, 'crop' => true)); ?>
		<?php elseif($thumb == 'rect'): ?>
			<?= thumb($item->teaserimage()->toFile(), array('width' => 502, 'height' => 247, 'crop' => true)); ?>
		<?php elseif($thumb == 'large'): ?>
			<?= thumb($item->teaserimage()->toFile(), array('width' => 1010, 'height' => 564, 'crop' => true)); ?>
		<?php endif; ?>
		<span></span>
		<h2><?php echo $item->headline() ?></h2>
	</a>
</div>
