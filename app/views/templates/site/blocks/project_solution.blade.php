<?php
Photo::preload($image_big, $image_small);
?>

<h3>{{ $title }}</h3>
<div>
    @if (isset($image_big) && is_object($image_big))
        <img src="{{ $image_big->full() }}" />
    @endif
    @if (isset($image_small) && is_object($image_small))
        <img src="{{ $image_small->full() }}" />
    @endif
</div>
<div>
    {{ $text }}
</div>
<hr/>